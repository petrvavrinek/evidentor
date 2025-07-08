import config from "@/config/app";

export default function VersionTag() {
  return (
    <div className="fixed text-center bottom-0 w-[150px] right-[-44px] p-5 rotate-315 bg-orange-300">
      {config.AppVersion}
    </div>
  );
}
