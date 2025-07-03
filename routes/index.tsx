export default function Home() {
  return (
    <div className="text-white">
      <script type="text/javascript" src="/cursor_effects.js" defer>
      </script>
      <div id="scene"></div>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <h1 id="title">51 Pegasi B</h1>
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
        0,0
      </div>
    </div>
  );
}
