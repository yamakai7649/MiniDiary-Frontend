import Sidebar from "../../components/Sidebar/Sidebar";
import Timeline from "../../components/Timeline/Timeline";
import { useSelector } from "react-redux";
import "./Home.css";

export default function Home({comment}) {
  const user = useSelector((state) => {
    return state.AuthReducer.user;
  });
  
  return (
    <>
      <div className="homeContainer">
        <Sidebar ></Sidebar>
        {comment ? <Timeline comment></Timeline> : <Timeline ></Timeline>}
      </div>
    </>
  )
}
