import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Ayah = () => {

    const [ayah, setAyah] = useState([''])

    const apiURL = 'https://api.quran.com/api/v4/verses/random?language=en&words=true';
    
    const ayahNumb = Math.floor(Math.random() * 6236) + 1 
    const urlEnglish = `https://api.alquran.cloud/ayah/"+${ayahNumb}+"/en.asad`
    const urlArabic = `https://api.alquran.cloud/ayah/${ayahNumb}`

    useEffect(( ) => {
       axios.get(urlArabic)
       .then(response => {
        setAyah(response.data.data);
        console.log(response.data.data);
       })
      }, []);
  

    return (    
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="max-w-xs p-4 m-6 bg-white rounded-3xl shadow-xl">
        <div class="flex flex-col space-y-4 h-full justify-between">
          <div class="flex flex-col items-center md:items-start">
            <h1 className=  "text-base font-medium text-gray-400"> Ayah Number {ayah.number}</h1>
            <h5  className="text-xs font-medium mb-2 text-xs text-opacity-25"> Ayah Number {ayah.number}   </h5>
      
            <h2 class="text-base font-medium text-2xl text-gray-400">{ayah.text}</h2>
      
            <p class="text-sm">
              text
            </p>
      
            <h2 class="text-base font-medium text-gray-400">Address</h2>
            <p class="text-sm"> </p>
          </div>
          <div class="flex justify-center space-x-3 md:justify-end items-end">
            <button class="bg-blue rounded-3xl md:flex-rows">
              <p> Read More... </p>
            </button>
          </div>
        </div>
      </div>
</div>
    )
}

export default Ayah
