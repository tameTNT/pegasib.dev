export default function Home() {
  return (
    <div className="text-white">
      <script type="text/javascript" src="/cursor_effects.js" defer></script>
      <div id="scene"></div>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          <h1 class="col-span-4" id="title">51 Pegasi b</h1>
          <a href="https://www.linkedin.com/in/luca-huelle/" target="_blank">
            <div className="icon">
              <object data="icons/linkedin.svg" />
            </div>
          </a>
          <a href="https://github.com/tameTNT" target="_blank">
            <div className="icon">
              <object data="icons/github.svg" />
            </div>
          </a>
          <a href="mailto:wave@pegasib.dev">
            <div className="icon">
              <object data="icons/email.svg" />
            </div>
          </a>
          <a href="https://en.wikipedia.org/wiki/51_Pegasi_b" target="_blank">
            <div className="icon">
              <object data="icons/wikipedia.svg" />
            </div>
          </a>
        </div>
      </div>
      <div className="absolute right-1 bottom-1">
        <i>
          By ESO/Digitized Sky Survey 2 -{" "}
          <a
            rel="nofollow"
            class="external text"
            target="_blank"
            href="https://www.eso.org/public/images/eso1517c/"
          >
            ESO website
          </a>,{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0"
            target="_blank"
            title="Creative Commons Attribution 4.0"
          >
            CC BY 4.0
          </a>,{" "}
          <a
            href="https://commons.wikimedia.org/w/index.php?curid=39719449"
            target="_blank"
          >
            Link
          </a>
        </i>
      </div>
      <div className="hidden absolute left-1 bottom-1" id="debug">
        x=0.000,y=0.000,angle=0.000
      </div>
    </div>
  );
}
