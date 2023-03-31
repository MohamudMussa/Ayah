import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import { useGetSurahQuery } from '../redux/features/api/apiSlice';
import { useAudioAyahQuery, useEnglishAyahQuery } from '../redux/features/ayah/ayahSlice';
import { Close, Search2 } from './Icons';

const SearchAyah = ({ setShowModal, showModal }) => {
    const { data: surahs } = useGetSurahQuery();
    const [selectedSurah, setSelectedSurah] = useState(1)
    const [selectedAyah, setSelectedAyah] = useState(1)
    const [numberofayahs, setNumberofayahs] = useState(7)
    const [skip, setSkip] = useState(true)

    
    
    const { data: audio, isLoading, isSuccess } = useAudioAyahQuery({
        surah: selectedSurah,
        ayah: selectedAyah
    },
        { skip: skip }
    )
    const { data: english } = useEnglishAyahQuery({
        surah: selectedSurah,
        ayah: selectedAyah
    },
        { skip: skip }
    )



    useEffect(() => {
        if (surahs?.data.length > 0) {
            setNumberofayahs(surahs.data.find(s => s.number == selectedSurah).numberOfAyahs)
        }
    }, [selectedSurah])


    // handle submit 
    const handleSubmit = (e) => {
        e.preventDefault();
        setSkip(false)

    }
    useEffect(() => {
        if (isSuccess) setShowModal(false)
    }, [isSuccess])



    // close modal when click on outside of the modal

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            setShowModal(false);
        }
    })
    if (!showModal) return null
    return (
        <div className={` modal fixed transition-all  duration-300 inset-0 md:flex md:items-center px-2 md:px-0`} >
            <div className=" modal-body relative bg-white bg-opacity-70 backdrop-blur mx-auto  rounded-lg text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-4 lg:p8 " >

                {/* modal body */}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="border-b pb-2 flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-700 flex items-center gap-2 ">
                            <img
                                className="h-8 w-8 rounded-full"
                                src={logo}

                                alt="logo"
                            />  Search for an Ayah
                        </h3>
                        <div onClick={() => setShowModal(false)} className="cursor-pointer -top-10 right-0 bg-gray-200 hover:bg-red-600 bg-opacity-50 text-red-500 hover:text-white transition-all p-1 rounded ">
                            <Close className="w-5 h-5 " />
                        </div>
                    </div>
                    <div className="mt-2">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 focus:outline-none" htmlFor="surah-number">
                                    Select Surah
                                </label>
                                <select
                                    onChange={e => {
                                        setSelectedSurah(e.target.value)
                                    }}
                                    className="w-full rounded border bg-white bg-opacity-10 appearance-none focus:outline-none border-gray-300 py-2  text-base pl-3 pr-10">
                                    {surahs?.data?.map(surah => {
                                        return <option
                                            value={surah.number}
                                            key={surah.number}
                                        > {surah.englishName}  - {surah.name}</option>
                                    })}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ayah-number">
                                    Ayah Number
                                </label>

                                <select onChange={e => setSelectedAyah(e.target.value)} className="w-full rounded border bg-white bg-opacity-10 appearance-none focus:outline-none border-gray-300 py-2  text-base pl-3 pr-10">

                                    {[...Array((numberofayahs + 1)).keys()].slice(1).map(ayah => {
                                        return <option key={ayah}> {ayah} </option>
                                    })}
                                </select>
                            </div>
                            <div className="mb-4 w-full">
                                <button className='w-full rounded bg-indigo-500 hover:bg-indigo-600 text-white py-3 flex items-center justify-center gap-2'> {isLoading ? "Loading..." : <Search2 />} </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SearchAyah