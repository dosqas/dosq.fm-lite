export const filterAndSortSongs = (
    songs: {
      id: number;
      albumCover: string;
      title: string;
      artist: string;
      album: string;
      genre: string;
      dateListened: string;
    }[],
    filterTitle: string,
    filterArtist: string,
    filterAlbum: string,
    filterGenre: string,
    sortCriteria: "title" | "artist" | "date"
  ) => {
    return songs
      .filter((song) =>
        filterGenre ? song.genre.toLowerCase() === filterGenre.toLowerCase() : true
      )
      .filter((song) =>
        filterAlbum ? song.album.toLowerCase().includes(filterAlbum.toLowerCase()) : true
      )
      .filter((song) =>
        filterArtist ? song.artist.toLowerCase().includes(filterArtist.toLowerCase()) : true
      )
      .filter((song) =>
        filterTitle ? song.title.toLowerCase().includes(filterTitle.toLowerCase()) : true
      )
      .sort((a, b) => {
        if (sortCriteria === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortCriteria === "artist") {
          return a.artist.localeCompare(b.artist);
        } else if (sortCriteria === "date") {
          const dateA = new Date(
            Number(a.dateListened.split(", ")[1].split("/")[2]),
            Number(a.dateListened.split(", ")[1].split("/")[1]) - 1,
            Number(a.dateListened.split(", ")[1].split("/")[0]),
            Number(a.dateListened.split(", ")[0].split(":")[0]),
            Number(a.dateListened.split(", ")[0].split(":")[1])
          );
          const dateB = new Date(
            Number(b.dateListened.split(", ")[1].split("/")[2]),
            Number(b.dateListened.split(", ")[1].split("/")[1]) - 1,
            Number(b.dateListened.split(", ")[1].split("/")[0]),
            Number(b.dateListened.split(", ")[0].split(":")[0]),
            Number(b.dateListened.split(", ")[0].split(":")[1])
          );
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });
  };