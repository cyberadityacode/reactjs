import { Outlet, useNavigation } from "react-router";
import Home from "../../pages/Home";
import Footer from "./Footer";
import Header from "./Header";
import ShimmerEffectMovie from "../../pages/ShimmerEffectMovie";

export default function AppLayout() {
  const navigation = useNavigation();
  console.log(navigation);

  // if (navigation.state === "loading") return <h1>loading...</h1>;

  return (
    <>
      <Header />
      {navigation.state === "loading" ? <ShimmerEffectMovie /> : <Outlet />}
      <Footer />
    </>
  );
}
