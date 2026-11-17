FIX COMPLETE

Axios import in AdminRoute.jsx fixed.

Changed line 3 in src/Components/router/AdminRoute.jsx:
  import api from "../api/axios";
to
  import api from "../../api/axios";

Build: PASSED
All API endpoints verified (HTTP 200)
No duplicate Axios instances
No auth logic changes
No .env modifications

Done.