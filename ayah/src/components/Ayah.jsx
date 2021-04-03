import React, { useEffect, useState } from 'react'
import axios from 'axios'
import background from '../images/image2.jpg'


const Ayah = () => {

  const [ayah, setAyah] = useState([''])

  const [surah, setSurah] = useState([''])

  const [eng, setEng] = useState([''])



  const apiURL = 'https://api.quran.com/api/v4/verses/random?language=en&words=true';

  const ayahNumb = Math.floor(Math.random() * 6236) + 1
  const urlEnglish = `https://api.alquran.cloud/ayah/${ayahNumb}/en.asad`
  const urlArabic = `https://api.alquran.cloud/ayah/${ayahNumb}`

  useEffect(() => {
    axios.all([
      axios.get(urlArabic),
      axios.get(urlEnglish)
    ])
    .then(axios.spread((urlArabic, urlEnglish) => {
        setAyah(urlArabic.data.data);
        console.log(urlArabic.data.data)
        setSurah(urlArabic.data.data.surah);
        setEng(urlEnglish.data.data);
        console.log(urlEnglish.data.data);
      }))
  }, []);

  const images = ['',  ]

  return (


    <div class=" flex items-center justify-center min-h-screen bg-gray-600" style={{ backgroundImage: `url('${background}')` }}>
       
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
                <h1 class="text-center font-mono text-xs text-center text-white	"> Revealed In {surah.revelationType}  </h1>

    
              </div>
              <div class="flex justify-center space-x-3 md:justify-end items-end">
                
                <button class="bg-blue rounded-3xl md:flex-rows">
                  <div class="pt-6"></div>
              
                </button>
              </div>
            </div>
            <h5 class="text-right  font-mono  text-xs text-white text-opacity-50	 text-center	"> ({surah.number}/{eng.numberInSurah})   </h5>

          </div>
        </div>
      </div>
    </div>
    </div>

  )
}

export default Ayah
