import DynamicComponent from './DynamicComponent'
import SbEditable from 'storyblok-react'
import styles from "../styles/MainMenu.module.css"

const MainMenu = ({ blok }) => (
  <div className={styles.menuContainer}>
    {blok.reference.content.body.map((blok) => (
      <DynamicComponent blok={blok} key={blok._uid} />
    ))}
  </div>
)

export default MainMenu
