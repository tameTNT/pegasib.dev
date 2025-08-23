export default function Home() {
  return (
    <div class="text-white">
      <div id="spaceScene"></div>
      <div class="flex flex-row min-h-screen justify-center items-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center px-5 md:w-2/3">
          <h1 class="col-span-2 md:col-span-4 -mb-4">
            51<br class="md:hidden" /> Pegasi b
          </h1>
          <div class="col-span-2 md:col-end-4 text-lg text-center">
            <p>Personal site of Luca&nbsp;Huelle</p>
            <p>Programming & Applied Mathematics Graduate</p>
          </div>
          <div class="h-9 icon col-start-1">
            <a href="/links/linkedin" target="_blank">
              <object data="icons/linkedin.svg" />
            </a>
          </div>
          <div class="h-9 icon">
            <a href="/links/github" target="_blank">
              <object data="icons/github.svg" />
            </a>
          </div>
          <div class="h-9 icon">
            <a href="mailto:wave@pegasib.dev">
              <object data="icons/email.svg" />
            </a>
          </div>
          <div class="h-9 icon">
            <a href="/links/wikipedia" target="_blank">
              <object data="icons/wikipedia.svg" />
            </a>
          </div>
        </div>
      </div>
      <div class="absolute right-1 bottom-1 text-right text-xs md:text-base italic">
        <p>
          Background by ESO/Digitized Sky Survey
          2:<br className="md:hidden" />
          {" "}<a
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
          Planet favicon by Vicons Design from <br className="md:hidden" />
          <a
            href="https://thenounproject.com/browse/icons/term/planet/"
            target="_blank"
            title="Planet Icons"
          >
            Noun Project
          </a>{" "}
          (CC BY 3.0)
        </p>
      </div>
      <div class="absolute left-1 top-1 text-xs text-gray-500 italic hover:underline">
        <a href="/links/heardle">LOONA Heardle game</a>
      </div>
      <div class="hidden absolute left-1 bottom-1" id="debug">
        x=0.000,y=0.000,angle=0.000
      </div>
    </div>
  );
}
