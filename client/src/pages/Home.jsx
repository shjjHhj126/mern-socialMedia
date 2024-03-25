import Topbar from "../components/Topbar";
import Leftbar from "../components/Leftbar";
import Feed from "../components/Feed";
import Rightbar from "../components/Rightbar";

export default function Home() {
  return (
    <div>
      <Topbar />
      <div className="flex w-full">
        <Leftbar />
        <Feed />
        <Rightbar />
      </div>
    </div>
  );
}
