// import React from "react";
// import { Link } from "react-router-dom";
// import { CardContainer } from "./styles";
// import { IoIosFolderOpen, IoMdPerson, IoMdMore } from "react-icons/io";

// export default function Card({ data }) {
//   console.log(data);
  
//   return (
    
//     <CardContainer background="https://gstatic.com/classroom/themes/SocialStudies.jpg">
//       <ul>
//         <li>
//           <header>
//             <Link to={`classroom/${data._id}`}>{data.name}</Link>
//             <button className="optionsCardBtn">
//               <IoMdMore size={25} color="white" />
//             </button>
//             <p>{data.description} (Semester {data.semester})</p>
//           </header>

//           <div className="footerCard">
//             <button>
//               <IoIosFolderOpen size={25} color="rgb(77, 72, 72)" />
//             </button>
//             <button>
//               <IoMdPerson size={25} color="rgb(77, 72, 72)" />
//             </button>
//           </div>
//         </li>
//       </ul>
//     </CardContainer>
//   );
// }

// import React from 'react'

// import {Link} from 'react-router-dom';

// // STYLE
// import { CardContainer } from './styles'

// // ICONS
// import { IoIosFolderOpen , IoMdPerson, IoMdMore } from 'react-icons/io'


// export default function Card({data}) {
//     console.log(data);
//     return (
//       <>
//       <CardContainer background={data.background}>
//         <ul >
//           <li>
//             <header >
//               <Link to={`tasks/${data._id}`} >{data.name}</Link>

//               <button className="optionsCardBtn">
//                 <IoMdMore size={25}  color="white"/>
//               </button>

//               <p>{data.description+" ("+data.semester+")"}</p>



//             </header>

//             <div className="whitespace">
//               <img src={data.avatar} alt="Adorable!" />
//             </div>

//             <div className="footerCard">

//             <button>
//               <IoIosFolderOpen size={25}  color="rgb(77, 72, 72)"/>
//             </button>

//             <button>
//               <IoMdPerson size={25}  color="rgb(77, 72, 72)"/>
//             </button>

//             </div>
//           </li>
//         </ul>
//       </CardContainer>

//   </>

//     )

// }

import React from "react";
import { Link, useHistory } from "react-router-dom";

// STYLE
import { CardContainer } from "./styles";

// ICONS
import { IoIosFolderOpen, IoMdPerson, IoMdMore } from "react-icons/io";

export default function Card({ data }) {
  const history = useHistory();

  const handleViewClassroomDetails = () => {
    history.push(`/classroom-details/${data._id}`); // Navigate to classroom details page
  };

  return (
    <CardContainer background={data.background}>
      <ul>
        <li>
          <header>
            <Link to={`tasks/${data._id}`}>{data.name}</Link>
            <button className="optionsCardBtn">
              <IoMdMore size={25} color="white" />
            </button>
            <p>{data.description + " (" + data.semester + ")"}</p>
          </header>

          <div className="whitespace">
            <img src={data.avatar} alt="Adorable!" />
          </div>

          <div className="footerCard">
            <button>
              <IoIosFolderOpen size={25} color="rgb(77, 72, 72)" />
            </button>

            <button onClick={handleViewClassroomDetails}>
              <IoMdPerson size={25} color="rgb(77, 72, 72)" />
            </button>
          </div>
        </li>
      </ul>
    </CardContainer>
  );
}
