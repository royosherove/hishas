import { nanoid } from "nanoid";
import { useAppSelector } from "../red/store";

export const InvestiatorStatus = ()=>{
    const classNames = (text) => text;
    const agents = useAppSelector(state=>state.discovery.agents);
    return (
      <div className={(agents.length===0?'hidden ':'') + `
      text-xl w-screen px-2 bottom-2  font-mono right-2 rounded-lg shadow-md opacity-70 
      md:fixed md:text-xs md:w-auto md:p-0
      `}>
      <table className="rounded-md block p-4 bg-blue-400">
        <tbody className="even:bg-gray-400">
          {agents.map((a) => (
            <tr key={nanoid()} >
              <td>{a.name}:</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );


}

export default InvestiatorStatus;