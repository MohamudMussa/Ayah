'use client'

import { motion } from 'framer-motion'

export default function AyahSkeleton() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center gap-4 text-center px-2 py-6 min-h-[200px] justify-center"
    >
      <div className="space-y-3 w-full max-w-sm">
        <div className="shimmer h-5 w-28 mx-auto rounded-md" />
        <div className="h-2" />
        <div className="shimmer h-7 w-full rounded-md" />
        <div className="shimmer h-7 w-4/5 mx-auto rounded-md" />
        <div className="h-1" />
        <div className="shimmer h-4 w-full rounded-md" />
        <div className="shimmer h-4 w-3/4 mx-auto rounded-md" />
        <div className="h-1" />
        <div className="shimmer h-3 w-14 mx-auto rounded-md" />
      </div>
    </motion.div>
  )
}
