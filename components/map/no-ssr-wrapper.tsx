import { PropsWithChildren } from "react";
import dynamic from "next/dynamic";

const NoSSRWrapper = (props: PropsWithChildren) => <>{props.children}</>;

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
