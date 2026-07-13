import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

// A tidy, single-weight icon set drawn to a 24px grid. Stroke inherits
// currentColor so icons take the surrounding text color.
function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
  </Icon>
)
export const PartnerIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20.5S3.5 15 3.5 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 1.8C20.5 15 12 20.5 12 20.5Z" />
  </Icon>
)
export const LoadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 13a7 7 0 0 1 7 7H5a7 7 0 0 1 7-7Z" />
    <path d="M12 13 15 8" />
  </Icon>
)
export const ChatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" />
  </Icon>
)
export const CoachIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l1.8 4.4L18 9l-4.2 1.6L12 15l-1.8-4.4L6 9l4.2-1.6L12 3Z" />
    <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
  </Icon>
)
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </Icon>
)
export const CameraIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.2" />
  </Icon>
)
export const VideoIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="6" width="12" height="12" rx="2" />
    <path d="M15 10.5 21 7v10l-6-3.5" />
  </Icon>
)
export const MicIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </Icon>
)
export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 13a4 4 0 0 0 5.7.3l3-3A4 4 0 0 0 13 4.6l-1.7 1.7" />
    <path d="M14 11a4 4 0 0 0-5.7-.3l-3 3A4 4 0 0 0 11 19.4l1.7-1.7" />
  </Icon>
)
export const TimerIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 13V9M9 2h6" />
  </Icon>
)
export const BellIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Icon>
)
export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L14 16l4 1.5V21a1 1 0 0 1-1 1A16 16 0 0 1 3 6a1 1 0 0 1 1-1Z" />
  </Icon>
)
export const VideoCallIcon = VideoIcon
export const BackIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 5 8 12l7 7" />
  </Icon>
)
export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15V4M8 7.5 12 3.5 16 7.5" />
    <path d="M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" />
  </Icon>
)
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a1 1 0 0 1 1-1h10" />
  </Icon>
)
export const XIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)
export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
  </Icon>
)
export const LogOutIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 12H5M8 9l-3 3 3 3" />
    <path d="M11 4h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-7" />
  </Icon>
)
export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.5" y="10" width="15" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Icon>
)
export const HandsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 11 5.5 9.5a1.5 1.5 0 0 1 2-2L10 10V4.5a1.5 1.5 0 0 1 3 0V10l.5-5a1.5 1.5 0 0 1 3 .3l-.3 6.2a6 6 0 0 1-6 5.5 6 6 0 0 1-5.2-3L3 13a1.5 1.5 0 0 1 2-2l2 2" />
  </Icon>
)
export const SparkleIcon = CoachIcon
export const ClockIcon = TimerIcon
