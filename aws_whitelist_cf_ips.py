# /// script
# dependencies = [
#   "boto3",
#   "botocore",
#   "requests",
# ]
# ///

import boto3
import requests
from botocore.exceptions import ClientError

# --- CONFIGURATION ---
SECURITY_GROUP_ID = "sg-01f56315173a15add"  # "Cloudflare IPs" security group
AWS_REGION = "eu-west-2"
PORTS_TO_OPEN = [443]  # HTTPS only
# ---------------------

def get_cloudflare_ips():
    """Fetches the latest IPv4 and IPv6 ranges from Cloudflare."""
    print("Fetching current IP ranges from Cloudflare...")
    try:
        response = requests.get("https://api.cloudflare.com/client/v4/ips")
        response.raise_for_status()
        data = response.json()
        
        ipv4_ips = data["result"]["ipv4_cidrs"]
        ipv6_ips = data["result"]["ipv6_cidrs"]
        
        return ipv4_ips, ipv6_ips
    except Exception as e:
        print(f"Error fetching IPs from Cloudflare: {e}")
        raise

def sync_security_group():
    # Initialize AWS EC2 client
    ec2 = boto3.client("ec2", region_name=AWS_REGION)
    
    # 1. Fetch latest Cloudflare IPs
    cf_ipv4, cf_ipv6 = get_cloudflare_ips()
    
    # 2. Get the current rules of the Security Group
    try:
        sg_info = ec2.describe_security_groups(GroupIds=[SECURITY_GROUP_ID])
        current_ingress_rules = sg_info["SecurityGroups"][0]["IpPermissions"]
    except ClientError as e:
        print(f"Failed to describe Security Group: {e}")
        return

    # 3. Parse existing Cloudflare-like rules to clear them out safely
    # (This ensures we don't accumulate old/stale Cloudflare IPs)
    old_ipv4_rules_to_revoke = []
    old_ipv6_rules_to_revoke = []
    
    for rule in current_ingress_rules:
        # We only care about modifying our targeted web ports
        if rule.get("FromPort") in PORTS_TO_OPEN:
            if rule.get("IpRanges"):
                old_ipv4_rules_to_revoke.append(rule)
            if rule.get("Ipv6Ranges"):
                old_ipv6_rules_to_revoke.append(rule)

    # 4. Revoke old rules if they exist to start fresh
    if old_ipv4_rules_to_revoke or old_ipv6_rules_to_revoke:
        print("Removing outdated Cloudflare rules from Security Group...")
        try:
            # Reconstruct permissions block safely for revocation
            # Boto3 requires specific payload matching what's being deleted
            for rule in current_ingress_rules:
                if rule.get("FromPort") in PORTS_TO_OPEN:
                    ec2.revoke_security_group_ingress(
                        GroupId=SECURITY_GROUP_ID,
                        IpPermissions=[rule]
                    )
            print("Successfully cleared old rules.")
        except ClientError as e:
            print(f"Error revoking old rules: {e}")
            return

    # 5. Build new IP permission payloads
    new_ip_permissions = []
    
    for port in PORTS_TO_OPEN:
        ipv4_ranges = [{"CidrIp": ip, "Description": "Cloudflare IPv4 - programmatically added"} for ip in cf_ipv4]
        ipv6_ranges = [{"CidrIpv6": ip, "Description": "Cloudflare IPv6 - programmatically added"} for ip in cf_ipv6]
        
        new_ip_permissions.append({
            "IpProtocol": "tcp",
            "FromPort": port,
            "ToPort": port,
            "IpRanges": ipv4_ranges,
            "Ipv6Ranges": ipv6_ranges
        })

    # 6. Authorize new rules
    print(f"Authorising {len(cf_ipv4)} IPv4 and {len(cf_ipv6)} IPv6 ranges on ports {PORTS_TO_OPEN}...")
    try:
        ec2.authorize_security_group_ingress(
            GroupId=SECURITY_GROUP_ID,
            IpPermissions=new_ip_permissions
        )
        print("🚀 Security Group successfully updated with current Cloudflare IPs!")
    except ClientError as e:
        print(f"Error authorizing new rules: {e}")

if __name__ == "__main__":
    sync_security_group()
