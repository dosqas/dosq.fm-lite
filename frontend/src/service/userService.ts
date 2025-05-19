export const fetchUploadedVideo = async (serverIp: string): Promise<{ videoPath: string | null }> => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`https://${serverIp}/api/user/get-profile-video`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return { videoPath: data.videoPath || null };
      } else {
        console.error("Failed to fetch the profile video.");
        return { videoPath: null };
      }
    } catch (error) {
      console.error("Error fetching the profile video:", error);
      return { videoPath: null };
    }
  };