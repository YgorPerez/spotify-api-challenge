import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../../server/api/root";
import getBaseUrl from "../../../utils/get-base-url";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
	res.status(200).send(
		renderTrpcPanel(appRouter, {
			url: `${getBaseUrl()}/api/trpc`,
			transformer: "superjson",
		})
	);
}
