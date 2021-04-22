import React, { useEffect, useState } from 'react'
import axios from 'axios'
import background from '../images/image2.jpg'




const Ayah = () => {

  const [ayah, setAyah] = useState([''])

  const [surah, setSurah] = useState([''])

  const [eng, setEng] = useState([''])

  // const bck = ['../images/image2.jpg', '../images/image1.jpg', '../images/image3.jpg']


// const randombackground = bck[Math.floor(Math.random()*bck.length)];


  const ayahNumb = Math.floor(Math.random() * 6236) + 1
  const urlEnglish = `https://api.alquran.cloud/ayah/${ayahNumb}/en.asad`
  const urlArabic = `https://api.alquran.cloud/ayah/${ayahNumb}`

  useEffect(() => { 
    axios.all([
      axios.get(urlArabic),
      axios.get(urlEnglish)
    ])
    .then(axios.spread((urlArabic,  urlEnglish) => {
        setAyah(urlArabic.data.data);
        // console.log(urlArabic.data.data)
        setSurah(urlArabic.data.data.surah);
        setEng(urlEnglish.data.data);
        // console.log(urlEnglish.data.data);
      }))
  },  []);

  const refreshPage = () => {
    axios.all([
      axios.get(urlArabic),
      axios.get(urlEnglish)
    ])
    .then(axios.spread((urlArabic,  urlEnglish) => {
        setAyah(urlArabic.data.data);
   
        setSurah(urlArabic.data.data.surah);
        setEng(urlEnglish.data.data);
      
      }))

  }


  return (


    <div class=" flex items-center justify-center min-h-screen bg-gray-600" style={{ backgroundImage: `url(${background})` }}>
      
       
      <div class="max-w-5xl  p-4 m-6  rounded-3xl shadow-xl 	"  style={{ backgroundImage: `url('${background}')` }}>


        <div class="bg-fixed">  


          <div class="flex flex-col space-y-4 h-full justify-between">
        
            <div className="text-base text-1xl font-medium text-white text-center 	"> {surah.name}


              <div className="font-mono text-base text-xs font-small text-white text-center	">  {surah.englishName} - {surah.englishNameTranslation}  </div>
              <div class="pt-6"></div>
              
              <div class="flex flex-col items-center md:items-start">

              <div >

                <h2 class="text-base font-medium text-xl text-white	 text-center	">   ۞ {ayah.text}   </h2>   
              
              
                <div class="pt-6"></div>
                
                <h5 class="text-base  font-mono font-medium text-xs text-white	 text-center	"> - {eng.text}  </h5>


                <div class="pt-8"></div>
                <h1 class="text-center  font-mono text-xs text-center text-white	"> Revealed In {surah.revelationType}  </h1>

    
              </div >
      
            </div>
            <h5 class="text-right pb-2.5  font-mono  text-xs text-white text-opacity-50	 text-center	"> {surah.number}:{eng.numberInSurah}   </h5>
            
            <button type="button" onClick={refreshPage}> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
</svg> </button>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}

export default Ayah
