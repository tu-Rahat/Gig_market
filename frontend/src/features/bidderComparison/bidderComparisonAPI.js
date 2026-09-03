import {
    getOwnerTaskBids
} from "../bid/bidAPI";

import {
    getWorkerProfile
} from "../workerProfile/workerProfileAPI";


export const getComparisonBidders =
    async (taskId) => {

        const data =
            await getOwnerTaskBids(taskId);

        const bids =
            data.bids || [];

        const bidders =
            await Promise.all(
                bids.map(async (bid) => {

                    try {

                        const profileData =
                            await getWorkerProfile(
                                bid.bidder._id
                            );

                        return {
                            bid,
                            profileData
                        };

                    } catch (error) {

                        return {
                            bid,
                            profileData: null
                        };

                    }

                })
            );

        return bidders;

    };