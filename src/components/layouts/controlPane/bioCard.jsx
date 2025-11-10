import Card from "../../library/card.jsx";
import Blurb from "../../library/blurb.jsx";

const RealBio = () => {
  return (
    <Card
      title="Justin White"
      subtitle="hmu@justinwhite.work"
      image="/icos/Profile.png"
      className="w-full pb-4 backdrop-blur-xs"
      visibleChildren={1}
      visibleChildrenBottom={0}
    >

      <Blurb Header="About Me" Body="I'm Justin, a South Carolina-based developer pursuing data center or backend engineering." />

      <Blurb Header="What I Do" Body="Freelance web developer specializing in responsive, fast, and accessible sites using React, Astro, and Tailwind." />

      <Blurb Header="Current Focus" Body="Collecting certifications (IT Support, Automation, Data Analytics) while hunting for my first job in the space." />

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