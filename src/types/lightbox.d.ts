declare module "yet-another-react-lightbox" {
  import * as React from "react";
  export interface Slide {
    src: string;
  }
  export interface LightboxProps {
    open: boolean;
    close: () => void;
    index?: number;
    slides: Slide[];
    plugins?: any[];
  }
  const Lightbox: React.FC<LightboxProps>;
  export default Lightbox;
}

declare module "yet-another-react-lightbox/plugins/thumbnails" {
  const Thumbnails: any;
  export default Thumbnails;
}

declare module "yet-another-react-lightbox/plugins/zoom" {
  const Zoom: any;
  export default Zoom;
}
