FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ARG BaseApiAddress
RUN echo "BaseApiAddress is $BaseApiAddress "

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/SWI.SoftStock.WebApplications.Main/SWI.SoftStock.WebApplications.Main.csproj", "src/SWI.SoftStock.WebApplications.Main/"]
RUN dotnet restore "src/SWI.SoftStock.WebApplications.Main/SWI.SoftStock.WebApplications.Main.csproj"
COPY . .
WORKDIR "/src/src/SWI.SoftStock.WebApplications.Main"
RUN dotnet build "SWI.SoftStock.WebApplications.Main.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SWI.SoftStock.WebApplications.Main.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SWI.SoftStock.WebApplications.Main.dll"]