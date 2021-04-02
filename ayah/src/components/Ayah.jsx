import React, {useEffect, useState} from 'react'
import axios from 'axios'
import background from '../images/quran.jpg'

const Ayah = () => {

    const [ayah, setAyah] = useState([''])
    
    const [surah, setSurah] = useState([''])

    const apiURL = 'https://api.quran.com/api/v4/verses/random?language=en&words=true';
    
    const ayahNumb = Math.floor(Math.random() * 6236) + 1 
    const urlEnglish = `https://api.alquran.cloud/ayah/"+${ayahNumb}+"/en.asad`
    const urlArabic = `https://api.alquran.cloud/ayah/${ayahNumb}`

    useEffect(( ) => {
       axios.get(urlArabic)
       .then(response => {
        setAyah(response.data.data);
        setSurah(response.data.data.surah);
        console.log(response.data.data);
       })
      }, []);
  

    return (    


      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="max-w-5xl p-4 m-6 bg-white rounded-3xl shadow-xl">
          

        <div class="bg-fixed">


        <div class="flex flex-col space-y-4 h-full justify-between">
        <div className=  "text-base text-1xl font-medium text-gray-400 text-center 	"> {surah.name}
 

        <div className=  "font-mono text-base text-xs font-small text-gray-400 text-center	">  {surah.englishName} - {surah.englishNameTranslation}  </div>
        <div class="pt-6"></div>  
          <div class="flex flex-col items-center md:items-start">
  
           
            <h2 class="text-base font-medium text-xl text-gray-400 text-center	">{ayah.text}</h2>
      
            <p class="text-sm">
     
            </p>
      
            <h5  className="text-xs font-medium mb-2 text-xs text-opacity-25">    </h5>
            <p class="text-xs	"> </p>
          </div>
          <div class="flex justify-center space-x-3 md:justify-end items-end">
            <button class="bg-blue rounded-3xl md:flex-rows">
            <div class="pt-6"></div>
              <h5 class="text-center font-mono text-xs text-center text-gray-400 "> Ayah Number {ayah.number}  </h5>
            </button>
          </div>
        </div>
        </div>
      </div>
</div>
</div>

    )
}

export default Ayah
