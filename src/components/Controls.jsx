import React from 'react';
import { saveAsJpeg } from 'save-html-as-image';
import { Download, Pause, Play, Refresh, Screenshot, Search } from './Icons';


const Controls = ({ props }) => {
    const { play, setPlay, refresh, imgRef, randomizeBg, setShowModal } = props;

    const downloadImg = () => {
        saveAsJpeg(imgRef.current, {
            fileName: "ayah",
            quality: 1
        });
    };

    return (
        <div className='flex gap-1 items-center justify-center my-3'>
            <button className=" p-2 outline-none md:hover:bg-gray-300 md:hover:bg-opacity-20 rounded md:hover:-translate-y-1 md:hover:scale-110 transition-all" type="button" onClick={refresh} >
                <Refresh className="w-6 h-6 md:w-5 md:h-5 mt-1" />
            </button>
            <button className=" p-2 outline-none md:hover:bg-gray-300 md:hover:bg-opacity-20 rounded md:hover:-translate-y-1 md:hover:scale-110 transition-all" onClick={downloadImg} >
                <Download className="w-6 h-6 md:w-5 md:h-5" />
            </button>
            <button className=" p-2 outline-none md:hover:bg-gray-300 md:hover:bg-opacity-20 rounded md:hover:-translate-y-1 md:hover:scale-110 transition-all" onClick={() => setShowModal(true)} >
                <Search className="w-6 h-6 md:w-5 md:h-5" />

            </button>

            {
                play === false ?
                    <button className=" p-2 outline-none md:hover:bg-gray-300 md:hover:bg-opacity-20 rounded md:hover:-translate-y-1 md:hover:scale-110 transition-all" onClick={() => setPlay(true)} >
                        <Play className="w-6 h-6 md:w-5 md:h-5" />
                    </button>
                    :
                    <button className=" p-2 outline-none md:hover:bg-gray-300 md:hover:bg-opacity-20 rounded md:hover:-translate-y-1 md:hover:scale-110 transition-all" onClick={() => setPlay(false)} >
                        <Pause className="w-6 h-6 md:w-5 md:h-5" />
                    </button>
            }

            <button className=" p-2 outline-none md:hover:bg-gray-300 md:hover:bg-opacity-20 rounded md:hover:-translate-y-1 md:hover:scale-110 transition-all" onClick={randomizeBg} >
                <Screenshot className="w-6 h-6 md:w-5 md:h-5" />

            </button>
        </div>
    )
}

export default Controls