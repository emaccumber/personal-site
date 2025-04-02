import SbEditable from "storyblok-react";
import FeaturedImage from "./FeaturedImage";
import MainMenu from "./MainMenu";
import HeaderLink from "./HeaderLink";
import InfoBody from "./Paragraph";
import InstagramURL from "./InstaComonent";

// resolve Storyblok components to Next.js components
const Components = {
  "featured-image": FeaturedImage,
  main_menu: MainMenu,
  header_link: HeaderLink,
  InfoBody: InfoBody,
  instagram_url: InstagramURL,
};

const DynamicComponent = ({ blok }) => {
  // check if component is defined above
  if (typeof Components[blok.component] !== "undefined") {
    const Component = Components[blok.component];
    // wrap with SbEditable for visual editing
    return (
      <SbEditable content={blok}>
        <Component blok={blok} />
      </SbEditable>
    );
  }

  // fallback if the component doesn't exist
  return (
    <p>
      The component <strong>{blok.component}</strong> has not been created yet.
    </p>
  );
};

export default DynamicComponent;
