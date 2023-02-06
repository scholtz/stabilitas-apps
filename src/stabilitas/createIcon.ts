import { writeFileSync } from "fs";
import currencies from "../../.config/currencies.json";
const createIcon = () => {
  const template =
    "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDEwMCAxMDAiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzM3NiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nb0JHTi5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMi4yICg3MzJhMDFkYTYzLCAyMDIyLTEyLTA5KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczM4MCI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDExMTIiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZjlmYmVjO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwLjk1NTIyMzg2IgogICAgICAgICBpZD0ic3RvcDExMDgiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkY2I0Mzg7c3RvcC1vcGFjaXR5OjE7IgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMTExMCIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDExMTIiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQxMTE0IgogICAgICAgY3g9IjUwIgogICAgICAgY3k9IjUwIgogICAgICAgZng9IjUwIgogICAgICAgZnk9IjUwIgogICAgICAgcj0iNTAiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz4KICA8L2RlZnM+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXczNzgiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSI1LjAxIgogICAgIGlua3NjYXBlOmN4PSItMjYuNzQ2NTA3IgogICAgIGlua3NjYXBlOmN5PSI1MS4yOTc0MDUiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIzODQwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjIwODkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMzc2IiAvPgogIDxjaXJjbGUKICAgICBjeD0iNTAiCiAgICAgY3k9IjUwIgogICAgIHI9IjUwIgogICAgIGlkPSJjaXJjbGUzNzQiCiAgICAgc3R5bGU9ImZpbGwtb3BhY2l0eToxO2ZpbGw6dXJsKCNyYWRpYWxHcmFkaWVudDExMTQpIiAvPgogIDx0ZXh0CiAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NDUuOTAzNnB4O2xpbmUtaGVpZ2h0OjEuMjU7Zm9udC1mYW1pbHk6VmVyZGFuYTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidWZXJkYW5hLCBOb3JtYWwnO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXBzOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO2ZpbGw6IzUwNDQxNjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC42ODg1NTMiCiAgICAgeD0iNTUuMTcxNTEzIgogICAgIHk9IjUwLjIyMDY1NCIKICAgICBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIgogICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgaWQ9InRleHQxNTUzIgogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC45MzMyMTk0NSwxLjA3MTU1OTMpIj48dHNwYW4KICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICBpZD0idHNwYW4xNTUxIgogICAgICAgeD0iNTUuMTcxNTEzIgogICAgICAgeT0iNTAuMjIwNjU0IgogICAgICAgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIKICAgICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuNDc0MTA2Ij5DWks8L3RzcGFuPjwvdGV4dD4KICA8dGV4dAogICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjQ1LjkwMzZweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OlZlcmRhbmE7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonVmVyZGFuYSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiM3ODY3MjE7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNjg4NTUzIgogICAgIHg9IjU0LjQ4Mjk2IgogICAgIHk9IjUwLjkwOTIwNiIKICAgICBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIgogICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgaWQ9InRleHQxNTUzLTkiCiAgICAgdHJhbnNmb3JtPSJzY2FsZSgwLjkzMzIxOTQ1LDEuMDcxNTU5MykiPjx0c3BhbgogICAgICAgc29kaXBvZGk6cm9sZT0ibGluZSIKICAgICAgIGlkPSJ0c3BhbjE1NTEtNyIKICAgICAgIHg9IjU0LjQ4Mjk2IgogICAgICAgeT0iNTAuOTA5MjA2IgogICAgICAgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIKICAgICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuNDc0MTA2Ij5DWks8L3RzcGFuPjwvdGV4dD4KICA8dGV4dAogICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjQ1LjkwMzZweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OlZlcmRhbmE7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonVmVyZGFuYSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiNhYTg4MDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNjg4NTUzIgogICAgIHg9IjUzLjc5NDQwNyIKICAgICB5PSI1MS41OTc3NjMiCiAgICAgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIKICAgICB0ZXh0LWFuY2hvcj0ibWlkZGxlIgogICAgIGlkPSJ0ZXh0MTU1My05LTUiCiAgICAgdHJhbnNmb3JtPSJzY2FsZSgwLjkzMzIxOTQ1LDEuMDcxNTU5MykiPjx0c3BhbgogICAgICAgc29kaXBvZGk6cm9sZT0ibGluZSIKICAgICAgIGlkPSJ0c3BhbjE1NTEtNy00IgogICAgICAgeD0iNTMuNzk0NDA3IgogICAgICAgeT0iNTEuNTk3NzYzIgogICAgICAgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIKICAgICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgICBzdHlsZT0ic3Ryb2tlLXdpZHRoOjAuNDc0MTA2Ij5DWks8L3RzcGFuPjwvdGV4dD4KICA8dGV4dAogICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjQ1LjkwMzZweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OlZlcmRhbmE7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonVmVyZGFuYSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiNkNGFhMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNjg4NTUzIgogICAgIHg9IjUzLjEwNTg1IgogICAgIHk9IjUyLjI4NjMxNiIKICAgICBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIgogICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgaWQ9InRleHQxNTUzLTktNS0zIgogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC45MzMyMTk0NSwxLjA3MTU1OTMpIj48dHNwYW4KICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICBpZD0idHNwYW4xNTUxLTctNC0yIgogICAgICAgeD0iNTMuMTA1ODUiCiAgICAgICB5PSI1Mi4yODYzMTYiCiAgICAgICBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIgogICAgICAgdGV4dC1hbmNob3I9Im1pZGRsZSIKICAgICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MC40NzQxMDYiPkNaSzwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4K";
  const data = Buffer.from(template, "base64").toString("utf8");
  currencies.forEach((element) => {
    const customized = data.replace(/CZK/gi, element.alpha);
    writeFileSync(`./icons/${element.alpha}.svg`, customized, {
      flag: "w",
    });
    console.log(`./icons/${element.alpha}.svg done`);
  });
};
export default createIcon;
