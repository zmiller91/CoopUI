import "../globals.css"
import Header from "./header"
import Sidebar from "./sidebar"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen">
        <div className="h-full">
          <Header/>
          <div className="grid sm:grid-cols-[20%_auto] gap-2 sm:h-[calc(100vh-56px)]">

              <div>
                <Sidebar/>
              </div>

              <div>
                {children}
              </div>
            
          </div>

        </div>
      </body>
    </html>
  )
}