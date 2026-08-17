
export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  duration?: number;
  audioUrl: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

export const playlists: Playlist[] = [
  {
    id: "p1",
    name: "Classic Hits",
    tracks: [
    {
        id: "m0",
        title: "Bahut Jatate Ho Pyar",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/1.%20Bahut%20Jatate%20Ho%20Pyar.mp3"
    },
    {
        id: "m1",
        title: "Hamne Tumko Dil Ye De Diya",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/10.%20Hamne%20Tumko%20Dil%20Ye%20De%20Diya.mp3"
    },
    {
        id: "m2",
        title: "Woh Ladki Bahut Yaad Aati",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/11.%20Woh%20Ladki%20Bahut%20Yaad%20Aati.mp3"
    },
    {
        id: "m3",
        title: "To Chalun",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/12.%20To%20Chalun.mp3"
    },
    {
        id: "m4",
        title: "Dil Ke Badle Sanam",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/13.%20Dil%20Ke%20Badle%20Sanam.mp3"
    },
    {
        id: "m5",
        title: "Kitna Pyaara Tujhe Rabne Banaya",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/14.%20Kitna%20Pyaara%20Tujhe%20Rabne%20Banaya.mp3"
    },
    {
        id: "m6",
        title: "Bheed Mein",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/15.%20Bheed%20Mein.mp3"
    },
    {
        id: "m7",
        title: "Is Tarah Aashiqui Ka",
        artist: "Kumar Sanu Version",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/16.%20Is%20Tarah%20Aashiqui%20Ka%20-%20Kumar%20Sanu%20Version.mp3"
    },
    {
        id: "m8",
        title: "Zindagi Ban Gaye Ho Tum",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/17.%20Zindagi%20Ban%20Gaye%20Ho%20Tum.mp3"
    },
    {
        id: "m9",
        title: "Dheere Dheere Se Meri Zindagi Mein Aana",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/18.%20Dheere%20Dheere%20Se%20Meri%20Zindagi%20Mein%20Aana.mp3"
    }
]
  },
  {
    id: "p2",
    name: "Golden Era",
    tracks: [
    {
        id: "m10",
        title: "Shaam Bhi Khoob Hai",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/19.%20Shaam%20Bhi%20Khoob%20Hai.mp3"
    },
    {
        id: "m11",
        title: "Hum Tumko Nigahon Mein",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/2.%20Hum%20Tumko%20Nigahon%20Mein.mp3"
    },
    {
        id: "m12",
        title: "Tere Dar Par Sanam",
        artist: "Male Version",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/20.%20Tere%20Dar%20Par%20Sanam%20-%20Male%20Version.mp3"
    },
    {
        id: "m13",
        title: "Dil Laga Liya Maine",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/21.%20Dil%20Laga%20Liya%20Maine.mp3"
    },
    {
        id: "m14",
        title: "Meri Mehbooba",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/22.%20Meri%20Mehbooba.mp3"
    },
    {
        id: "m15",
        title: "Aksar Is Duniya Mein",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/23.%20Aksar%20Is%20Duniya%20Mein.mp3"
    },
    {
        id: "m16",
        title: "Sau Rab Di",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/24.%20Sau%20Rab%20Di.mp3"
    },
    {
        id: "m17",
        title: "Paas Woh Aane Lage",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/25.%20Paas%20Woh%20Aane%20Lage.mp3"
    },
    {
        id: "m18",
        title: "Kore Kore Sapne",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/26.%20Kore%20Kore%20Sapne.mp3"
    },
    {
        id: "m19",
        title: "Tumhein Dekhen Meri Aankhen",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/27.%20Tumhein%20Dekhen%20Meri%20Aankhen.mp3"
    }
]
  },
  {
    id: "p3",
    name: "Melody Rewind",
    tracks: [
    {
        id: "m20",
        title: "Tu Pyar Hai Kisi Aur Ka",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/28.%20Tu%20Pyar%20Hai%20Kisi%20Aur%20Ka.mp3"
    },
    {
        id: "m21",
        title: "Sajan Sajan Teri Dulhan",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/29.%20Sajan%20Sajan%20Teri%20Dulhan.mp3"
    },
    {
        id: "m22",
        title: "Aapke Pyaar Mein Hum",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/3.%20Aapke%20Pyaar%20Mein%20Hum.mp3"
    },
    {
        id: "m23",
        title: "Waadiye Ishq Se (From _Rahbar_)",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/30.%20Waadiye%20Ishq%20Se%20(From%20_Rahbar_).mp3"
    },
    {
        id: "m24",
        title: "Ek Dil Hai",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/4.%20Ek%20Dil%20Hai.mp3"
    },
    {
        id: "m25",
        title: "Pehli Pehli Baar Mohabbat Ki Hai",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/5.%20Pehli%20Pehli%20Baar%20Mohabbat%20Ki%20Hai.mp3"
    },
    {
        id: "m26",
        title: "Dil Mera Tod Diya",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/6.%20Dil%20Mera%20Tod%20Diya.mp3"
    },
    {
        id: "m27",
        title: "Dil Ne Yeh Kaha Hain Dil Se",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/7.%20Dil%20Ne%20Yeh%20Kaha%20Hain%20Dil%20Se.mp3"
    },
    {
        id: "m28",
        title: "Main Agar Saamne",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/8.%20Main%20Agar%20Saamne.mp3"
    },
    {
        id: "m29",
        title: "Pehli Pehli Baar Mohabbat Ki Hai (From _Sirf Tum_)",
        artist: "Various Artists",
        film: "Nostalgia",
        year: 2000,
        audioUrl: "/music/9.%20Pehli%20Pehli%20Baar%20Mohabbat%20Ki%20Hai%20(From%20_Sirf%20Tum_).mp3"
    }
]
  }
];
