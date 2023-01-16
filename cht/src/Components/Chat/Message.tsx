import React from 'react'

interface Props {
  text: string,
  position: string
}
const Message: React.FC<Props> = ({ text, position }: Props): JSX.Element => {
  return (
    <div className={`flex ${position === "right" ? "flex-row-reverse" : ''} m-1`}>
      <p className='bg-gray-500 max-w-[15rem] text-xs break-all'>
        {text}
      </p>

    </div>
  )
}

export default Message