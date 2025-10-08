
export default function Loading() {
  return (
    <div className='h-screen'>
      <div className='mt-16 flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
          <div className='flex-col-center py-12'>
            <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
            <h2 className='mb-4 font-title text-xl'>Loading products...</h2>
            <p className='max-w-md text-center font-subtitle text-gray-600'>
              Please wait while we fetch the latest products for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
