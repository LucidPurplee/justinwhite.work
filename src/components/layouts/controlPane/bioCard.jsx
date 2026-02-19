import Card from "../../library/card.jsx";
import Blurb from "../../library/blurb.jsx";

const RealBio = () => {
  return (
    <Card
      title="Justin White"
      subtitle="hmu@justinwhite.work"
      image="/icos/Profile4.jpg"
      className="w-full pb-4 backdrop-blur-xs"
      visibleChildren={1}
      visibleChildrenBottom={0}
    >

      <Blurb Header="About Me" Body="Justin. South Carolina–based developer and SNHU student." />

      <Blurb Header="What I Do" Body="I work in frontend and UX building fast, accessible sites with React, Astro, and Tailwind, and keeping projects organized and sane." />

      <Blurb Header="Current Focus" Body="Finishing my degree, leaning into project management and UX, and gaining hands-on product experience." />

    </Card>
  );
};

const CensoredBio = () => {
  return (
    <Card
      title="First Last"
      subtitle="hmu@site.site"
      image="https://placehold.co/100x100/png"
      className="w-full"
      visibleChildren={1}
    >
      <Blurb Header="About me" Body="I'm [persona], an aspiring data center or backend engineer collecting certifications while freelancing as a web developer in South Carolina." />
      <Blurb Header="Section 2" Body="This should hide/show on click" />
    </Card>
  );
};

export default RealBio;