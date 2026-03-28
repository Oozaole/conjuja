# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "paramiko",
# ]
# ///
import paramiko
import os
import time

hostname = '119.45.173.182'
username = 'root'
password = '7uN7WBZVis.XZeg'
pub_key = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKjCuvGEu5nFxFGQF8M+bog5aitNyR88P3sRASJnk1hB A@DESKTOP-NRJUNJH'

dist_dir = os.path.join(os.path.dirname(__file__), 'dist')
remote_dir = '/var/www/html'

def deploy():
    print("Connecting to server...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, port=22, username=username, password=password)
    
    # 1. Setup SSH Key
    print("Configuring SSH Key...")
    ssh.exec_command('mkdir -p ~/.ssh && chmod 700 ~/.ssh')
    # Use single quotes around public key so bash processes it as one string safely
    ssh.exec_command(f'echo "{pub_key}" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys')
    
    # 2. Install and configure Nginx
    print("Installing Nginx if not exists...")
    stdin, stdout, stderr = ssh.exec_command('dpkg -l | grep nginx || (apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y nginx)')
    print(stdout.read().decode())
    print(stderr.read().decode())
    
    # 3. Create destination directory
    print("Preparing remote directory...")
    ssh.exec_command(f'rm -rf {remote_dir}/*')
    ssh.exec_command(f'mkdir -p {remote_dir}')
    
    # 4. Upload dist files
    print("Uploading dist folder...")
    sftp = ssh.open_sftp()
    
    def upload_dir(local_path, remote_path):
        try:
            sftp.mkdir(remote_path)
        except IOError:
            pass  # Directory likely exists
        for item in os.listdir(local_path):
            l_path = os.path.join(local_path, item)
            r_path = f"{remote_path}/{item}"
            if os.path.isfile(l_path):
                sftp.put(l_path, r_path)
            elif os.path.isdir(l_path):
                upload_dir(l_path, r_path)
                
    upload_dir(dist_dir, remote_dir)
    
    # Ensure proper permissions
    ssh.exec_command(f'chown -R www-data:www-data {remote_dir} && chmod -R 755 {remote_dir}')
    
    sftp.close()
    ssh.close()
    print("Deployment completed successfully!")

if __name__ == '__main__':
    deploy()
