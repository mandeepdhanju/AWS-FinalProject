import { getYear } from '../utilities/utilities';
import { FaLinkedinIn } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { AiFillGithub } from 'react-icons/ai';
// import { gitHubURL, linkedInURL, email } from '../globals/global';


const Footer = () => (
    <footer>
        <p>&copy; {getYear()} Mandy Dhanju from SSD.</p>
    </footer>
);

export default Footer;