export default function Home() {
  return (
    <div className="text-white">
      <script type="text/javascript" src="/home_icon_swell.js" defer></script>
      <div id="spaceScene"></div>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="grid grid-cols-4 gap-4 justify-items-center px-20 w-2/3">
          <h1 class="col-span-4">51 Pegasi b</h1>
          <div className="-mt-4 col-span-2 col-end-4 text-lg text-center">
            <p>Personal site of Luca Huelle</p>
            <p>Programming & Applied Mathematics Graduate</p>
          </div>
          <a
            class="col-start-1"
            href="/links/linkedin"
            target="_blank"
          >
            <div className="icon">
              <object data="icons/linkedin.svg" />
            </div>
          </a>
          <a href="/links/github" target="_blank">
            <div className="icon">
              <object data="icons/github.svg" />
            </div>
          </a>
          <a href="mailto:wave@pegasib.dev">
            <div className="icon">
              <object data="icons/email.svg" />
            </div>
          </a>
          <a href="/links/wikipedia" target="_blank">
            <div className="icon">
              <object data="icons/wikipedia.svg" />
            </div>
          </a>
        </div>
      </div>
      <div className="absolute right-1 bottom-1 text-right">
        <i>
          <p>
            Background by ESO/Digitized Sky Survey 2 -{" "}
            <a
              rel="nofollow"
              class="external text"
              target="_blank"
              href="https://www.eso.org/public/images/eso1517c/"
            >
              ESO website
            </a>,{" "}
            <a
              href="https://commons.wikimedia.org/w/index.php?curid=39719449"
              target="_blank"
            >
              Wikimedia
            </a>{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0"
              target="_blank"
              title="Creative Commons Attribution 4.0"
            >
              (CC BY 4.0)
            </a>
          </p>
          <p>
            Planet favicon by Vicons Design from{" "}
            <a
              href="https://thenounproject.com/browse/icons/term/planet/"
              target="_blank"
              title="Planet Icons"
            >
              Noun Project
            </a>{" "}
            (CC BY 3.0)
          </p>
        </i>
      </div>
      <div className="hidden absolute left-1 bottom-1" id="debug">
        x=0.000,y=0.000,angle=0.000
      </div>
    </div>
  );
}
