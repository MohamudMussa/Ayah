// import React, {useEffect, useState} from 'react'
// import axios from 'axios'

// const Eng = () => {

//     const ayahNumb = Math.floor(Math.random() * 6236) + 1

//     const urlEnglish = `https://api.alquran.cloud/ayah/${ayahNumb}/en.asad`
//     const [eng, setEng] = useState([''])



//     useEffect(() => {
//         axios.get(urlEnglish)
//           .then(response => {
//             setEng(response.data.data)
//             console.log(response.data.data);
//           })
//       }, []);

//     return (
//         <div>

// <h4 class="text-base font-medium text-md text-white	 text-center"> - {eng.text}  </h4>

            
//         </div>
//     )
// }

// export default Eng
