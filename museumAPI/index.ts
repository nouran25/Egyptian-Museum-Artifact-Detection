import axios, { AxiosInstance } from "axios";
import { MuseumSearchQuery, MuseumObjectSearchResult, Artwork } from "./types";

class MuseumAPIInstance {
  private baseUrl = "https://collectionapi.metmuseum.org/public/collection/v1";
  private axiosInstance: AxiosInstance = axios.create({
    baseURL: this.baseUrl,
  });

  public async search(
    query: MuseumSearchQuery
  ): Promise<MuseumObjectSearchResult> {
    const response = await this.axiosInstance.get<MuseumObjectSearchResult>(
      "/search",
      {
        params: query,
      }
    );
    return response.data;
  }

  public async getObject(objectId: number): Promise<Artwork> {
    const response = await this.axiosInstance.get<Artwork>(
      `/objects/${objectId}`
    );
    return response.data;
  }
}

const museumAPI = new MuseumAPIInstance();

export default museumAPI;
export * from "./types";
