import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";


const AnalyticsHelper = () => {

    const weeklyPlayData = useQuery(api.gamestats.getPastNDaysOfStats, { n: 7 });
    
    const gamesPlayedThisWeek = () => {
        // iterate only through the first 7 days if there are more than 7 days. if not, iterate through all
        if (weeklyPlayData && weeklyPlayData.length > 0) {
            return weeklyPlayData.reduce((acc, curr) => acc + Number(curr.count), 0);
        }
        else if (weeklyPlayData && weeklyPlayData.length > 7) {
            return weeklyPlayData.slice(0, 7).reduce((acc, curr) => acc + Number(curr.count), 0);
        }
        return 0;
    }
    
    const buildWeekData = () => {
        const data = [];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        if (weeklyPlayData && weeklyPlayData.length > 0) {
            const end = Math.min(weeklyPlayData.length, 7);
            for (let i = end - 1; i >= 0; i--) {
                const isoDate = weeklyPlayData[i].isoDay;
                const date = new Date(isoDate);
                const today = new Date();
                let dayOfWeek = daysOfWeek[date.getDay()];
                if (isoDate === today.toISOString().split("T")[0]) {
                    dayOfWeek = "Today";
                }
    
                data.push({
                    day: dayOfWeek,
                    gamesPlayed: Number(weeklyPlayData[i].count),
                });
            }
        }
        return data
    }
    
    const gamesPlayedToday = () => {
        // get first day played
        if (weeklyPlayData && weeklyPlayData.length > 0) {
            return Number(weeklyPlayData[0].count);
        }
        return 0;
    }
    
    const monthlyPlayData = useQuery(api.gamestats.getMonthlyGameStats);
    
    const gamesPlayedThisMonth = () => {
        if (monthlyPlayData && monthlyPlayData.length > 0) {
            return Number(monthlyPlayData[0].count);
        }
        return 0;
    }
    
    const buildMonthData = () => {
        const data = [];
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (monthlyPlayData && monthlyPlayData.length > 0) {
            const end = Math.min(monthlyPlayData.length, 12);
    
            for (let i = end - 1; i >= 0; i--) {
                const isoDate = monthlyPlayData[i].isoYearMonth;
                const month = isoDate.split("-")[1];
                const monthOfYear = monthsOfYear[Number(month) - 1];
                data.push({
                    month: monthOfYear,
                    gamesPlayed: Number(monthlyPlayData[i].count),
                });
    
            }
        }
        return data;
    }

    return { gamesPlayedToday, gamesPlayedThisWeek, gamesPlayedThisMonth, buildWeekData, buildMonthData };

}

export default AnalyticsHelper;