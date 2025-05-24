import { Outlet, useNavigation, useParams } from "react-router";
import Home from "../../pages/Home";
import Footer from "./Footer";
import Header from "./Header";
import ShimmerEffectMovie from "../../pages/ShimmerEffectMovie";

export default function AppLayout() {
  let totalShimmer=10;
  const navigation = useNavigation();
  console.log(navigation);

  console.log("Inside App Layout");
  let params = useParams();
  console.log('param-',params);
  console.log(Object.keys(params).length);
  const hasParam = Object.keys(params).length>0
  console.log('yess it hasParam ', hasParam);
  
  if(hasParam===true){
    totalShimmer =1;
  }else{
    totalShimmer =10;
  }
  // if (navigation.state === "loading") return <h1>loading...</h1>;

  return (
    <>
      <Header />
      { navigation.state === "loading"  ? <ShimmerEffectMovie totalShimmer={totalShimmer} /> : <Outlet />}
      {/* <ShimmerEffectMovie totalShimmer={totalShimmer} /> */}
      <Footer />
    </>
  );
}
