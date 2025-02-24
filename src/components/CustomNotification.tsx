import { ToastContentProps } from "react-toastify";

type CustomNotificationProps = ToastContentProps<{
  title: string;
  content: string;
}>;

function CustomNotification({
  closeToast,
  data,
  toastProps,
}: CustomNotificationProps) {
  const isColored = toastProps.theme === "colored";

  return (
    <div className="flex flex-col w-full">
      <h3
        className={`text-sm font-semibold ${
          isColored ? "text-white" : "text-zinc-800"
        }`}>
        {data.title}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-sm">{data.content}</p>
        <button
          onClick={() => {
            closeToast();
            window.location.reload();
          }}
          className={`ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95] ${
            isColored ? "bg-transparent" : "bg-zinc-900"
          }`}>
          Try again
        </button>
      </div>
    </div>
  );
}

export default CustomNotification;
