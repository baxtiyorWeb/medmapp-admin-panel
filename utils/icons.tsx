import type React from "react"
import {
  BiCalendarEvent,
  BiPhone,
  BiEnvelope,
  BiUser,
  BiClipboard,
  BiCheckCircle,
} from "react-icons/bi"
import { BsFileEarmarkArrowDown, BsPerson } from "react-icons/bs"

export const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactElement } = {
    person: <BsPerson />,
    "calendar-event": <BiCalendarEvent />,
    phone: <BiPhone />,
    envelope: <BiEnvelope />,
    "gender-ambiguous": <BiUser />,
    "person-vcard": <BsPerson />,
    "clipboard2-pulse": <BiClipboard />,
    "file-earmark-arrow-up": <BsFileEarmarkArrowDown />,
    "check2-all": <BiCheckCircle />,
  }

  return iconMap[iconName] || <BsPerson />
}
