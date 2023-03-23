import './Footer.css'

const Footer = () => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener, noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <div className='footerMainDiv'>
      <div className='footerInfo'>
        <div>
          <p>MyBnb by Ned Nguyen, 2023</p>
        </div>
        <div className='footerLink'>
          <a target='_blank' href=''>{<i class="fa-brands fa-github"></i>}</a>
          <a target='_blank' href='https://www.linkedin.com/in/ned-nguyen-693575257/'>{<i class="fa-brands fa-linkedin"></i>}</a>
        </div>
      </div>
      <div className='footerTech'>
        <p>Javascript</p>
        <p>React</p>
        <p>Redux</p>
        <p>HTML</p>
        <p>CSS</p>
        <p>Express</p>
      </div>
    </div>
  )
}

export default Footer;
