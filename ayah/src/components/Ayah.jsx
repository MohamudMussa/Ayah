import React, { useEffect, useState } from 'react'
import axios from 'axios'
import background from '../images/image9.jfif'
import ReactAudioPlayer from 'react-audio-player';

import ReactGA from 'react-ga';
import Search from './Search';

const trackingId = "UA-47496938-1"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);




// import { makeStyles } from '@material-ui/core/styles';



// const useStyles = makeStyles((theme) => ({
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: '#fff',
//   },
// }));



const Ayah = () => {

  // const classes = useStyles();

  const [ayah, setAyah] = useState([''])

  const [surah, setSurah] = useState([''])

  const [eng, setEng] = useState([''])
  
  const [audio, setAudio] = useState('')

  // const bck = ['../images/image2.jpg', '../images/image1.jpg', '../images/image3.jpg']


// const randombackground = bck[Math.floor(Math.random()*bck.length)];


  const ayahNumb = Math.floor(Math.random() * 6236) + 1
  const urlEnglish = `https://api.alquran.cloud/ayah/${ayahNumb}/en.sahih`
  const urlArabic = `https://api.alquran.cloud/ayah/${ayahNumb}`
  const ayahAudio = `http://api.alquran.cloud/v1/ayah/${ayahNumb}/ar.alafasy`



  
  const refreshPage = () => {
    axios.all([
      axios.get(urlArabic),
      axios.get(urlEnglish)
     
    ])
    .then(axios.spread((urlArabic,  urlEnglish) => {

        setSurah(urlArabic.data.data.surah);
        setEng(urlEnglish.data.data);
        setAyah(urlArabic.data.data);
      
      }, []))
      
  }

  useEffect(() => { 
    axios.all([
      axios.get(urlArabic),
      axios.get(urlEnglish),
      axios.get(ayahAudio)
    ])
    .then(axios.spread((urlArabic, urlEnglish, ayahAudio) => {
        
      setAudio(ayahAudio.data.data.audio)

      setAyah(urlArabic.data.data);
  
        setSurah(urlArabic.data.data.surah);
        setEng(urlEnglish.data.data);
      }))
  },  []);





  return (


    <div  class=" flex items-center justify-center min-h-screen "  style={{ backgroundImage: `url('${background}')`, backgroundSize: 'cover' }}>
      
   
       
      <div class="max-w-5xl  p-4 m-6  rounded-3xl shadow-xl  	"  style={{ backgroundImage: `url('${background}')` }}>


        <div class="bg-fixed">  
        


          <div class="flex flex-col space-y-4 h-full justify-between">
           
            <div className="text-base text-1xl font-medium text-white text-center 	"> {surah.name} 

              <div className="font-mono text-base text-xs font-small text-white text-center	">  {surah.englishName} - {surah.englishNameTranslation}  </div>
              <div class="pt-6"></div>
              
              <div class="flex flex-col items-center md:items-start">

              <div >

                <h2 class="text-base font-medium text-xl text-white	 text-center	">   ۞ {ayah.text}  </h2>   
              
                {/* ?ayah.text :  <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop> */}
                <div class="pt-6"></div>
                
                <h5 onClick={refreshPage} class="text-base  font-mono font-medium text-xs text-white	 text-center	"> - {eng.text ? eng.text : 'Click the refresh icon or anywhere to reveal an Ayah'}  </h5>


                <div class="pt-8"></div>
                <h1 class="text-center  font-mono text-xs text-center text-white	">  {surah.revelationType} Ayah </h1>


{/* 
                <ReactAudioPlayer
                className="audio"
  src={audio}
  autoPlay='false'
  controls

/> */}
    
              </div >



              
              {/* <buttom onClick={playAyah}> 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
</svg>
              </buttom> */}
            </div>
            <h5 class="text-right pb-2.5  font-mono  text-xs text-white text-opacity-50	 text-center	"> - {surah.number}:{eng.numberInSurah} -   </h5>
            
            <button type="button"  class='pr-2' onClick={refreshPage}> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
</svg> </button>

{/* <Search/> */}


<p class="text-black text-opacity-25 ... font-mono text-sm text-centre ">Aayah.app</p>


          </div>
        </div>
      </div>
    </div>
    </div>

  )
}

export default Ayah
