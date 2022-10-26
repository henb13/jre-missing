const missingEpisodes = [
  {
    full_name: "#374 - Marc Maron",
    episode_number: 374,
    isNew: false,
    date: {
      ms: 1643984238000,
      formatted: "February 4th, 2022",
      htmlAttribute: "2022-02-04",
    },
  },
  {
    full_name: "#320 - Tim Ferriss",
    episode_number: 320,
    isNew: false,
    date: {
      ms: 1644006629000,
      formatted: "February 4th, 2022",
      htmlAttribute: "2022-02-04",
    },
  },
];

const shortenedEpisodes = [
  {
    id: 2124,
    episode_number: 1877,
    full_name: "#1877 - Jann Wenner",
    isNew: true,
    isOriginalLength: false,
    changes: [
      {
        date: {
          ms: 1665010388000,
          formatted: "October 6th, 2022",
          htmlAttribute: "2022-10-06",
        },
        new_duration_string: "2 hr 51 min 39 sec",
        old_duration_string: "2 hr 51 min 46 sec",
      },
    ],
  },
  {
    id: 1943,
    episode_number: 1330,
    full_name: "#1330 - Bernie Sanders",
    isNew: false,
    isOriginalLength: false,
    changes: [
      {
        date: {
          ms: 1664486810000,
          formatted: "September 29th, 2022",
          htmlAttribute: "2022-09-29",
        },
        new_duration_string: "1 hr 17 min 9 sec",
        old_duration_string: "1 hr 51 min 46 sec",
      },
    ],
  },
  {
    id: 1389,
    episode_number: 1159,
    full_name: "#1159 - Neil deGrasse Tyson",
    isNew: true,
    isOriginalLength: true,
    changes: [
      {
        date: {
          ms: 1665005849000,
          formatted: "October 5th, 2022",
          htmlAttribute: "2022-10-05",
        },
        new_duration_string: "3 hr 21 min 8 sec",
        old_duration_string: "3 hr 21 min 3 sec",
      },
      {
        date: {
          ms: 1665005755000,
          formatted: "October 5th, 2022",
          htmlAttribute: "2022-10-05",
        },
        new_duration_string: "3 hr 21 min 3 sec",
        old_duration_string: "3 hr 21 min 8 sec",
      },
      {
        date: {
          ms: 1664919458000,
          formatted: "October 4th, 2022",
          htmlAttribute: "2022-10-04",
        },
        new_duration_string: "3 hr 21 min 6 sec",
        old_duration_string: "3 hr 21 min 7 sec",
      },
      {
        date: {
          ms: 1664919253000,
          formatted: "October 4th, 2022",
          htmlAttribute: "2022-10-04",
        },
        new_duration_string: "3 hr 21 min 7 sec",
        old_duration_string: "3 hr 21 min 8 sec",
      },
    ],
  },
  {
    id: 1340,
    episode_number: 1678,
    full_name: "#1678 - Michael Pollen",
    isNew: true,
    isOriginalLength: false,
    changes: [
      {
        date: {
          ms: 1665005849000,
          formatted: "October 5th, 2022",
          htmlAttribute: "2022-10-05",
        },
        new_duration_string: "3 hr 21 min 1 sec",
        old_duration_string: "3 hr 21 min 3 sec",
      },
      {
        date: {
          ms: 1665005755000,
          formatted: "October 5th, 2022",
          htmlAttribute: "2022-10-05",
        },
        new_duration_string: "3 hr 21 min 3 sec",
        old_duration_string: "3 hr 21 min 8 sec",
      },
      {
        date: {
          ms: 1664919458000,
          formatted: "October 4th, 2022",
          htmlAttribute: "2022-10-04",
        },
        new_duration_string: "3 hr 21 min 6 sec",
        old_duration_string: "3 hr 21 min 7 sec",
      },
      {
        date: {
          ms: 1664919253000,
          formatted: "October 4th, 2022",
          htmlAttribute: "2022-10-04",
        },
        new_duration_string: "3 hr 21 min 7 sec",
        old_duration_string: "3 hr 21 min 8 sec",
      },
    ],
  },
];

const lastCheckedInMs = 1665691453175;

const mockResponse = {
  missingEpisodes,
  shortenedEpisodes,
  lastCheckedInMs,
};

module.exports = { mockResponse };
