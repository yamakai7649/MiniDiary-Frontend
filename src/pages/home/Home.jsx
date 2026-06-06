import Sidebar from "../../components/Sidebar/Sidebar";
import Timeline from "../../components/Timeline/Timeline";
import "./Home.css";

export default function Home({comment}) {
  return (
    <>
      <div className="homeContainer">
        <Sidebar ></Sidebar>
        {comment ? <Timeline comment></Timeline> : <Timeline ></Timeline>}
      </div>
    </>
  )
}
