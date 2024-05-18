import Image from "next/image";

import Head from "next/head";

import heroImg from "../../public/assets/hero.png"

import styles from "@/styles/home.module.css";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface HomeProps{
  posts: number;
  comments: number
}


export default function Home({comments,posts}:HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize e crie tarefas em grupo</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            src={heroImg} 
            alt="Logo image"
            priority
          />
          <h1 className={styles.title}>Uma aplicação para você organizar 
            <br />suas tarefas e estudos.
          </h1>
        </div>

        <div className={styles.infoContent}>
            <section className={styles.box}>
              <span>+{posts} posts</span>
            </section>

            <section className={styles.box}>
              <span>+{comments} comentários</span>
            </section>
          </div>

      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments")
  const postRef = collection(db, "tasks")

  const commentSnapshot = await getDocs(commentRef)
  const postSnapshopt = await getDocs(postRef)

  return {
    props: {
      posts: postSnapshopt.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60
  }
}