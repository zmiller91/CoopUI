import "../globals.css"
import Header from "./header"
import Sidebar from "./sidebar"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <div className="grid grid-cols-[15%_auto] gap-2">
            <div>
              <Sidebar/>
            </div>
            <div>
              {children}
            </div>
        
          
        </div>
      </body>
    </html>
  )
}