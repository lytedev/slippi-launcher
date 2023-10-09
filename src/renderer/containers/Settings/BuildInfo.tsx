import { css } from "@emotion/react";
import moment from "moment";
import React from "react";

import { ExternalLink as A } from "@/components/ExternalLink";
import { useToasts } from "@/lib/hooks/useToasts";
import { useAdvancedUser } from "@/lib/useAdvancedUser";

const osInfo = window.electron.bootstrap.operatingSystem;

const appVersion = __VERSION__;
const buildDate = moment.utc(__DATE__);
const commitHash = __COMMIT__;

type BuildInfoProps = {
  enableAdvancedUserClick?: boolean;
  className?: string;
};

const DEV_THRESHOLD = 7;

export const BuildInfo = ({ className, enableAdvancedUserClick }: BuildInfoProps) => {
  const [clickCount, setClickCount] = React.useState(0);
  const isAdvancedUser = useAdvancedUser((store) => store.isAdvancedUser);
  const setIsAdvancedUser = useAdvancedUser((store) => store.setIsAdvancedUser);
  const { showWarning } = useToasts();
  const handleBuildNumberClick = () => {
    if (!enableAdvancedUserClick) {
      return;
    }

    setClickCount(clickCount + 1);
    if (clickCount < DEV_THRESHOLD - 1) {
      // We haven't clicked enough yet
      return;
    }

    if (!isAdvancedUser) {
      showWarning("I hope you know what you're doing...");
    }

    setIsAdvancedUser(!isAdvancedUser);
    setClickCount(0);
  };

  return (
    <div
      className={className}
      css={css`
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
        padding: 10px;
        line-height: 15px;
      `}
    >
      <div>
        Version {appVersion} (
        {isAdvancedUser ? (
          <A
            css={css`
              text-decoration: underline;
              cursor: pointer;
            `}
            href={`https://github.com/project-slippi/slippi-launcher/commit/${commitHash}`}
          >
            {commitHash}
          </A>
        ) : (
          `${commitHash}`
        )}
        )
      </div>
      <div>
        Build
        <span
          onClick={handleBuildNumberClick}
          css={css`
            text-decoration: ${enableAdvancedUserClick && isAdvancedUser ? "underline" : "initial"};
            margin-left: 4px;
          `}
        >
          {buildDate.format("YYYYMMDD")}
        </span>
      </div>
      <div>{osInfo}</div>
    </div>
  );
};
