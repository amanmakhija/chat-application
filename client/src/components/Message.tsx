import moment from "moment";
import { Media, Message as MessageType } from "../types";
import { useAuth } from "../providers/AuthProvider";
import { ImageWrapper } from "@/providers/ImageViewerProvider";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          href={part}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline inline-block break-all"
        >
          <span>{part}</span>
        </a>
      );
    }
    return part;
  });
}

interface MessageProps {
  message: MessageType;
  followed: boolean;
}

export default function Message({ message, followed }: MessageProps) {
  const { authUser } = useAuth();
  const fromMe = message.from?._id === authUser?._id;

  return (
    <li className={`w-full flex gap-3 items-end ${followed ? "mb-2" : "mb-4"}`}>
      <div
        className={`max-w-[80%] space-y-2 ${
          fromMe && "ml-auto flex flex-col items-end"
        }`}
      >
        {message.images?.map((image) => (
          <MessageImage key={image._id} image={image} />
        ))}
        {message.text && <MessageContent text={message.text} fromMe={fromMe} />}
        {!followed && <MessageMeta message={message} />}
      </div>
    </li>
  );
}

interface MessageContentProps {
  text: string;
  fromMe: boolean;
}

function MessageContent({ text, fromMe }: MessageContentProps) {
  return (
    <div
      className={`w-fit max-w-full px-4 py-3 rounded-md ${
        fromMe
          ? "bg-indigo-600 rounded-br-none"
          : "bg-neutral-800 rounded-bl-none"
      }`}
    >
      {linkify(text)}
    </div>
  );
}

interface MessageImageProps {
  image: Media;
}

function MessageImage({ image }: MessageImageProps) {
  return (
    <ImageWrapper image={image}>
      <div className="h-[12rem] md:h-[16rem] w-auto max-w-full overflow-hidden rounded-2xl shadow-xl">
        <img
          src={SERVER_BASE_URL + "/" + image.url}
          alt=""
          className="block h-[12rem] md:h-[16rem] object-cover"
        />
      </div>
    </ImageWrapper>
  );
}

interface MessageMetaProps {
  message: MessageType;
}

function MessageMeta({ message }: MessageMetaProps) {
  return (
    <div className={`w-fit text-xs text-neutral-400`}>
      {moment(message.timestamp).format("LT")}
    </div>
  );
}
