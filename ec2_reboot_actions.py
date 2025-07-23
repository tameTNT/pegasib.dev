# /// script
# dependencies = [
#   "cloudflare",
#   "python-dotenv",
#   "PyGithub",
# ]
# ///

from datetime import datetime, timezone
import os
import urllib.request

from cloudflare import Cloudflare
from dotenv import load_dotenv
from github import Github, Auth


load_dotenv()  # Loads CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID as well as GITHUB_ACCESS_TOKEN and GITHUB_REPO_URL

external_ip = urllib.request.urlopen('https://ident.me').read().decode('utf8')
print(f"EC2 server's new public IPv4 address: {external_ip}")


# == Update DNS record with server's new IPv4 address ==
client = Cloudflare()
zone_id = os.getenv("CLOUDFLARE_ZONE_ID")

DOMAIN_NAME = "pegasib.dev"
subdomains_to_update = ["51", "loona-heardle"]
for subdomain in subdomains_to_update:
    full_name = f"{subdomain}.{DOMAIN_NAME}"

    page = client.dns.records.list(
        zone_id=zone_id,
        type="A",
        name={"exact": full_name},
    )

    if page.success:
        result = page.result[0]
        target_record_id = result.id

        record_edit_resp = client.dns.records.edit(
            dns_record_id=target_record_id,
            zone_id=zone_id,
            name=full_name,
            ttl=1,
            type="A",
            comment=f"Updated via API at {datetime.now(timezone.utc).isoformat()}",
            content=external_ip,
            proxied=True,
        )
        print(f"Successfully updated Cloudflare DNS record for {full_name} with new IP address.")
    else:
        raise Exception(f"Unable to locate correct DNS record for {full_name}.")

# == Update GitHub repo actions REMOTE_HOST secret with new IPv4 address (for GitHub actions) ==
github_auth = Auth.Token(os.getenv("GITHUB_ACCESS_TOKEN"))
g = Github(auth=github_auth)

target_repo = g.get_repo(os.getenv("GITHUB_REPO_URL"))
target_repo.create_secret(
    secret_name="REMOTE_HOST",
    unencrypted_value=external_ip,
    secret_type="actions",
)
g.close()
print("Successfully updated GitHub repo actions secret REMOTE_HOST with new IP address.")
