import React, { useEffect, useState } from 'react'
import {Modal} from 'react-bootstrap'
import logo from '../images/new.png'
import axios from 'axios'
import background from '../images/image6.jpg'
import ReactAudioPlayer from 'react-audio-player';

import ReactGA from 'react-ga';

const trackingId = "UA-47496938-1"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);




const Ayah = () => {

  // const classes = useStyles();

  const [ayah, setAyah] = useState([''])

  const [surah, setSurah] = useState([''])

  const [eng, setEng] = useState([''])
  
  const [audio, setAudio] = useState('')



  //Search Modal 

  const [smShow, setSmShow] = useState(false);
  const handleClose = () => setSmShow(false);

  const [suraah, setSuraah] = useState('')
  const [aayah, setAayah] = useState('')

  //Audio Modal
  const [smAudio, setSmAudio] = useState(false);



  //Random Ayah Gen
  let ayahNumb = Math.floor(Math.random() * 6236) + 1
 
  
  const forward = () => {

    const forwardd = ayahNumb++
    
    console.log(forwardd)

    const aa = `https://api.alquran.cloud/ayah/${forwardd}/en.sahih`
    const bb = `https://api.alquran.cloud/ayah/${forwardd}`
    const cc = `http://api.alquran.cloud/v1/ayah/${forwardd}/ar.hudhaify`

    console.log(aa)


     axios.all([
      axios.get(aa),
      axios.get(bb),
      axios.get(cc)
    
    ])
    .then(axios.spread((aa,  bb, cc) => {
        setSurah(aa.data.data.surah);
        setEng(aa.data.data);
        setAyah(bb.data.data);
        setAudio(cc.data.data.audio)

      }, []))
    
  }

   


 

  // random ayah gen
  const urlEnglish = `https://api.alquran.cloud/ayah/${ayahNumb}/en.sahih`
  const urlArabic = `https://api.alquran.cloud/ayah/${ayahNumb}`
  const ayahAudio = `http://api.alquran.cloud/v1/ayah/${ayahNumb}/ar.hudhaify`


  //Ayah Search

  const searchedAyah = `${suraah}:${aayah}`
  const searchedEnglish = `https://api.alquran.cloud/ayah/${searchedAyah}/en.sahih`
  const searchedArabic = `https://api.alquran.cloud/ayah/${searchedAyah}`
  const searchedAudio = `http://api.alquran.cloud/v1/ayah/${searchedAyah}/ar.hudhaify`



  
  const refreshPage = () => {
    axios.all([
      axios.get(urlArabic),
      axios.get(urlEnglish),
      axios.get(ayahAudio)
     
    ])
    .then(axios.spread((urlArabic,  urlEnglish, ayahAudio) => {

        setSurah(urlArabic.data.data.surah);
        setEng(urlEnglish.data.data);
        setAyah(urlArabic.data.data);
        setAudio(ayahAudio.data.data.audio)

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


  //search useEffect

  const print = () => {
    axios.all([
      axios.get(searchedArabic),
      axios.get(searchedEnglish),
      axios.get(searchedAudio)
     
    ])
    
    .then(axios.spread((searchedArabic,  searchedEnglish, searchedAudio ) => {

        setSurah(searchedArabic.data.data.surah);
        setEng(searchedEnglish.data.data);
        setAyah(searchedArabic.data.data);
        setAudio(searchedAudio.data.data.audio)


        
        
      }, []))
 
  
    setSmShow(false)
    setSuraah('')
    setAayah('')
    
}




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

                <h2 class="text-base font-medium text-xl text-white	 text-center	"
                style={{alignSelf: "center", writingDirection: "rlt"}}>   {ayah.text}      </h2>

{/* <button> 

<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
</svg>

                </button>

                <button> 

                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

                </button> */}
{/* ۞ */}
              
                {/* ?ayah.text :  <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop> */}
                <div class="pt-6"></div>
                
                <h5  class="text-base  font-mono font-medium text-xs text-white	 text-center	"> - {eng.text ? eng.text : 'Click the refresh icon or anywhere to reveal an Ayah'}  </h5>


                <div class="pt-8"></div>
                <h1 class="text-center  font-mono text-xs text-center text-white	">  {surah.revelationType} Ayah </h1>

    
              </div >



            </div>
            <h5 class="text-right pb-2.5  font-mono  text-xs text-white text-opacity-50	 text-center	"> - {surah.number}:{eng.numberInSurah} -   </h5>
            
            <button type="button"  class='pr-4' onClick={refreshPage}> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
</svg> </button>


<button class='pr-4' onClick={() => setSmShow(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </button>
              
          <Modal
            className="opacity-80 rounded-3xl shadow-xl "
            size="sm"
            keyboard="true"
            show={smShow}
            onHide={() => setSmShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
      centered
          >
            <Modal.Header
             closeButton>

<img className="h-10 w-10  rounded-full" src={logo} alt="logo" />

     
              <Modal.Title
              class="pl-3 pt-1	 text-center font-mono text-md text-center text-black	"
              >
                Search for an Ayah
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

               
            <lable
                class="text-black text-opacity-55 ... font-mono text-sm text-centre "
                >
                  Surah Number
                </lable>
                <input 
                  placeholder="e.g Surah Fatiha would be 1"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"

                type="text"
                value={suraah}
                onChange={(e) => {setSuraah(e.target.value)}}
              

                />


<div class="pt-6 ..."/>

                <lable
                class="text-black text-opacity-55 ... font-mono text-sm text-centre "
                >
                  Ayah Number
                </lable>
                <input type="text"
                 class=" appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                 placeholder="e.g Ayah 2 of Surah Fatiha would be 2"
                value={aayah}
                onChange={(e) => {setAayah(e.target.value)}}
                
                />
                <div class="pt-6 ..."/>

                
              


                <button onClick={print}
                              type="submit"

                className="py-9	group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                > <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg> </button>
            
            

            

            </Modal.Body>
          </Modal>


          <button onClick={() => setSmAudio(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </button>
              
          <Modal
            className="opacity-80 rounded-3xl shadow-xl "

            size="sm"
            keyboard="true"
            show={smAudio}
            onHide={() => setSmAudio(false)}
      centered
          >

            
<div class="flex items-center justify-center  bg-red-lightest"
style={{background: '#F0F0F0	'}}> 
        
                <ReactAudioPlayer
                
  src={audio}

  controls

/>
</div>
          </Modal>

    
          
        


<p class="text-black text-opacity-25 ... font-mono text-sm text-centre ">Aayah.app</p>


          </div>
       
        
        </div>
      </div>
    </div>
    </div>

  )
}

export default Ayah
