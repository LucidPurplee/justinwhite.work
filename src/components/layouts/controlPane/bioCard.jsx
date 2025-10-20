import Card from "../../library/card.jsx";
import Blurb from "../../library/blurb.jsx";

const RealBio = () => {
  return (
    <Card
      title="Justin White"
      subtitle="hmu@justinwhite.work"
      image="/icos/Profile.png"
      className="w-full bg-base-100"
      visibleChildren={1}
    >
      <Blurb Header="About me" Body="This should always be visible" />
      <Blurb Header="Section 2" Body="This should hide/show on click" />

      <div class="flex flex-row gap-2 w-full">
        <a class="badge border-2 border-white/20 hidden md:flex" href="/"> Home </a>
      </div>
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
      <Blurb Header="About me" Body="This should always be visible" />
      <Blurb Header="Section 2" Body="This should hide/show on click" />
    </Card>
  );
};

export default RealBio;